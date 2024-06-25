import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import Papa from "papaparse";

import "./stilo.scss";

interface EnportilKampoj {
  csvEnporto: FileList;
}

const headers = [
  "termino",
  "signifo",
  "ekzemplo",
  "de",
  "en",
  "es",
  "fr",
  "ja",
  "pt",
  "zh",
] as const;
type Header = (typeof headers)[number];

type NomKongruo = [Header, string][];
const optimismaKongruigo = (csvTitoloj: string[]): NomKongruo => {
  const kongruitaj = headers.map<[Header, string | undefined]>(header => {
    const kongrui = (titolOpcioj: string[]): [Header, string | undefined] => {
      const kongruo = csvTitoloj.find(csvTitolo => {
        for (const titolOpcio of titolOpcioj) {
          if (csvTitolo.trim().toLowerCase() === titolOpcio) return true;
        }
      });
      return [header, kongruo];
    };
    switch (header) {
      case "de":
        return kongrui(["de", "germana", "deutsch", "german"]);
      case "en":
        return kongrui(["en", "angla", "english"]);
      case "es":
        return kongrui(["es", "hispana", "español", "spanish", "espanol"]);
      case "fr":
        return kongrui(["fr", "franca", "français", "french", "francais"]);
      case "ja":
        return kongrui(["ja", "japana", "japanese", "日本語", "にほんご"]);
      case "pt":
        return kongrui(["pt", "portugala", "português", "portuguese", "portugues"]);
      case "zh":
        return kongrui(["zh", "ĉina", "cxina", "china", "chinese", "中文"]);
      case "termino":
      case "ekzemplo":
      case "signifo":
        return kongrui([header]);
    }
  });
  return kongruitaj.filter(([, kongruo]) => typeof kongruo !== "undefined") as NomKongruo;
};

const troviDuoblan = (titoloj: string[]): string | undefined => {
  return titoloj.find((titolo, i, titoloj) => {
    for (let j = i + 1; j < titoloj.length; j++) {
      if (titolo === titoloj[j]) return true;
    }
  });
};

const CSVEnportilo = () => {
  const { register: registriEnportilon, handleSubmit, watch } = useForm<EnportilKampoj>();
  const traktiEnporton: SubmitHandler<EnportilKampoj> = ({ csvEnporto }) => {
    console.log(csvEnporto);
  };
  const enportoj = watch("csvEnporto");
  const [csvTitoloj, csvTitolojn] = useState<string[]>([]);
  const [enportEraro, enportEraron] = useState<string>();

  const legi = () => {
    const Dosiero = enportoj.item(0);
    if (!Dosiero) return console.log("Neniu dosiero elektita");

    const legilo = new FileReader();
    legilo.readAsText(Dosiero);
    legilo.onload = async e => {
      const rezulto = e.target?.result as string;
      const { data: vicoj } = Papa.parse<string[]>(rezulto, { skipEmptyLines: true });
      const trovitajCsvTitoloj = vicoj[0];

      if (trovitajCsvTitoloj.length === 0) {
        return enportEraron("CSV-dosiero ne enhavas kolumnojn.");
      }
      const vakaTitoloCxe = trovitajCsvTitoloj.findIndex(titolo => titolo.trim() === "");
      if (vakaTitoloCxe >= 0) {
        return enportEraron(
          `Kolumno-nomo ne povas esti vaka. Kontrolu kolumnon: ${vakaTitoloCxe + 1}`
        );
      }
      const trovitaDuoblaTitolo = troviDuoblan(trovitajCsvTitoloj);
      if (typeof trovitaDuoblaTitolo === "string") {
        return enportEraron(
          `Ne povas aperi duoblaj kolumno-nomoj. Kontrolu: "${trovitaDuoblaTitolo}"`
        );
      }

      enportEraron(undefined);
      csvTitolojn(trovitajCsvTitoloj);
      const kongruoj = optimismaKongruigo(vicoj[0]);
      vakigiTitolojn();
      for (const kongruo of kongruoj) {
        agordiTitolon(kongruo[0], { value: kongruo[0], label: kongruo[1] });
      }
    };
    legilo.onerror = e => {
      console.error("Eraro legante la csv dosieron", e);
      enportEraron("Eraro legante dosieron. Provu denove.");
    };
  };

  useEffect(() => {
    console.log(csvTitoloj, "csvHeaders");
  }, [csvTitoloj]);

  const {
    watch: watchHeaders,
    control: headerscontrol,
    setValue: agordiTitolon,
    reset: vakigiTitolojn,
  } = useForm<Record<Header, { value: Header; label: string } | undefined>>();

  const computedHeaders = watchHeaders();
  console.log(computedHeaders, "computedHeaders");
  const headerOptions = csvTitoloj
    .filter(header => {
      console.log(header, Object.values(computedHeaders), "FILTERING!!!");
      const availableHeaders = Object.values(computedHeaders).map(h => h?.label);
      console.log({ availableHeaders });
      return !availableHeaders.includes(header as Header);
    })
    .map(header => ({ value: header as Header, label: header }));
  console.log(headerOptions, "HEADER OPTIONS!");

  return (
    <div>
      <form onSubmit={handleSubmit(traktiEnporton)}>
        <label
          htmlFor="csv-enporto"
          className="pill px-4 pill--style-light pill--has-link pill--has-action"
        >
          Enporti CSV
        </label>
        <input
          {...registriEnportilon("csvEnporto", { required: true })}
          type="file"
          id="csv-enporto"
          accept=".csv"
          className="hidden"
        />
      </form>
      <button onClick={() => legi()}>Read</button>
      {enportEraro && <p className="text-red-500">{enportEraro}</p>}
      <form>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {headers.map(header => {
            const formattedHeader =
              header.length > 2
                ? header.charAt(0).toUpperCase() + header.slice(1)
                : header.toUpperCase();
            return (
              <div key={header} className="flex flex-col gap-y-1">
                <p className="mb-0 mx-2">{formattedHeader}</p>
                <Controller
                  control={headerscontrol}
                  name={header}
                  render={({ field: { name, onBlur, onChange, ref, value, disabled } }) => (
                    <Select<{ value: Header; label: string }>
                      key={name}
                      options={headerOptions}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                      ref={ref}
                      isDisabled={disabled}
                      isClearable
                      isSearchable
                      className="max-w-80 mx-2 mb-3"
                      classNames={{
                        singleValue: () => "elektilo-unuopa-valoro",
                        control: () => "elektilo-kontrolilo",
                        option: () => "elektilo",
                        menu: () => "elektilo-menuo m-0",
                        menuList: () => "elektilo-menuo",
                      }}
                    />
                  )}
                />
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default CSVEnportilo;

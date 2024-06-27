import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LoadingOverlay } from "payload/dist/admin/components/elements/Loading/";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import Papa from "papaparse";

import { TerminKampo } from "../../../../helpiloj/finpunktoj/kreiFinpunkton/helpiloj";
import useAlsxutiCsv from "../../../../helpiloj/mutacioj/useAlsxutiCsv";

import "./stilo.scss";
import { Rezulto as AlsxutRezulto } from "../../finpunktoj/alsxutiCsv";

interface EnportilKampoj {
  csvEnporto: FileList | undefined;
}

type NomKongruo = [TerminKampo, string][];
const optimismaKongruigo = (csvTitoloj: string[]): NomKongruo => {
  const kongruitaj = Object.values(TerminKampo).map<[TerminKampo, string | undefined]>(kampo => {
    const kongrui = (titolOpcioj: string[]): [TerminKampo, string | undefined] => {
      const kongruo = csvTitoloj.find(csvTitolo => {
        for (const titolOpcio of titolOpcioj) {
          if (csvTitolo.trim().toLowerCase() === titolOpcio) return true;
        }
      });
      return [kampo, kongruo];
    };
    switch (kampo) {
      case TerminKampo.DE:
        return kongrui([kampo, "germana", "deutsch", "german"]);
      case TerminKampo.EN:
        return kongrui([kampo, "angla", "english"]);
      case TerminKampo.ES:
        return kongrui([kampo, "hispana", "español", "spanish", "espanol"]);
      case TerminKampo.FR:
        return kongrui([kampo, "franca", "français", "french", "francais"]);
      case TerminKampo.JA:
        return kongrui([kampo, "japana", "japanese", "日本語", "にほんご"]);
      case TerminKampo.PT:
        return kongrui([kampo, "portugala", "português", "portuguese", "portugues"]);
      case TerminKampo.ZH:
        return kongrui([kampo, "ĉina", "cxina", "china", "chinese", "中文"]);
      case TerminKampo.Termino:
      case TerminKampo.Ekzemplo:
      case TerminKampo.Signifo:
        return kongrui([kampo]);
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

const maksimumajMalsukcesoj = 10;

const CSVEnportilo = (props: unknown) => {
  console.log(props, "FKasoefi");
  const {
    register: registriEnportilon,
    handleSubmit: traktiEnportilon,
    watch: observiEnporton,
  } = useForm<EnportilKampoj>();
  const {
    watch: observiTitolojn,
    control: titolKontrolilo,
    setValue: titolon,
    reset: vakigiTitolojn,
  } = useForm<Record<TerminKampo, { value: TerminKampo; label: string } | undefined>>();

  const enportoj = observiEnporton("csvEnporto");
  const [csvTitoloj, csvTitolojn] = useState<string[]>([]);
  const [enportEraro, enportEraron] = useState<string>();
  const [alsxutEraro, alsxutEraron] = useState<string>();
  const [datumVicoj, datumVicojn] = useState<string[][]>([]);

  const [vicarNumero, vicarNumeron] = useState<number>();
  const [alsxutRezultoj, alsxutRezultojn] = useState<
    (AlsxutRezulto & { ekstrajMalsukcesoj: number }) | undefined
  >();

  const router = useHistory();

  useEffect(() => {
    if (enportoj) legi(enportoj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enportoj]);

  const legi = useCallback(
    (enportoj: FileList) => {
      const Dosiero = enportoj.item(0);
      if (!Dosiero) return console.log("Neniu dosiero elektita");

      const legilo = new FileReader();
      legilo.readAsText(Dosiero);
      legilo.onload = async e => {
        csvTitolojn([]);
        vakigiTitolojn();
        datumVicojn([]);
        alsxutRezultojn(undefined);
        vicarNumeron(undefined);
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
        datumVicojn(vicoj.slice(1));
        const kongruoj = optimismaKongruigo(vicoj[0]);
        for (const kongruo of kongruoj) {
          titolon(kongruo[0], { value: kongruo[0], label: kongruo[1] });
        }
      };
      legilo.onerror = e => {
        console.error("Eraro dum legado de la csv dosiero", e);
        enportEraron("Eraro dum legado de la dosiero. Provu denove.");
      };
    },
    [titolon, vakigiTitolojn]
  );

  const computedHeaders = observiTitolojn();
  const headerOptions = csvTitoloj
    .filter(header => {
      const availableHeaders = Object.values(computedHeaders).map(h => h?.label);
      return !availableHeaders.includes(header as TerminKampo);
    })
    .map(header => ({ value: header as TerminKampo, label: header }));

  const { mutate: alsxutiCsv } = useAlsxutiCsv({
    onSuccess: rezulto => {
      alsxutRezultojn(antaŭaRezulto => {
        const malsukcesaj = antaŭaRezulto
          ? antaŭaRezulto.malsukcesaj.length > maksimumajMalsukcesoj
            ? antaŭaRezulto.malsukcesaj
            : antaŭaRezulto.malsukcesaj.concat(rezulto.malsukcesaj)
          : rezulto.malsukcesaj;
        const ekstrajMalsukcesoj =
          antaŭaRezulto && antaŭaRezulto.malsukcesaj.length > maksimumajMalsukcesoj
            ? antaŭaRezulto.ekstrajMalsukcesoj + rezulto.malsukcesaj.length
            : 0;
        return {
          ignoritaj: (antaŭaRezulto?.ignoritaj ?? 0) + rezulto.ignoritaj,
          kreitaj: (antaŭaRezulto?.kreitaj ?? 0) + rezulto.kreitaj,
          malsukcesaj,
          ekstrajMalsukcesoj,
        };
      });
      vicarNumeron(a => (a ?? 0) + 1);
    },
  });

  const kolumnoj = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(computedHeaders).map(([kolumno, valoro]): [TerminKampo, number | null] => {
          const indekso = csvTitoloj.findIndex(titolo => valoro?.label === titolo);
          return [kolumno as TerminKampo, indekso < 0 ? null : indekso];
        })
      ) as Record<TerminKampo, number | null>,
    [computedHeaders, csvTitoloj]
  );
  const ekalsxuti = () => {
    alsxutEraron(undefined);
    if (kolumnoj.termino === null) {
      alsxutEraron("Mankas kolumno por la termino");
      return vicarNumeron(undefined);
    }
    if (kolumnoj.signifo === null) {
      alsxutEraron("Mankas kolumno por la signifo");
      return vicarNumeron(undefined);
    }
    vicarNumeron(0);
    alsxutRezultojn(undefined);
  };
  useEffect(() => {
    if (typeof vicarNumero === "undefined") return;
    const opo = 20;
    const vicaro = datumVicoj.slice(vicarNumero * opo, (vicarNumero + 1) * opo);
    if (vicaro.length > 0) {
      alsxutiCsv({ kolumnoj, vicoj: vicaro, vicarNumero, opo });
    } else {
      console.log("Fino de la CSV-dosiero");
      vicarNumeron(undefined);
    }
  }, [vicarNumero]);

  const datumVicojEntute = datumVicoj.length;
  const traktitajEntute = alsxutRezultoj
    ? alsxutRezultoj.kreitaj +
      alsxutRezultoj.ignoritaj +
      alsxutRezultoj.malsukcesaj.length +
      alsxutRezultoj.ekstrajMalsukcesoj
    : 0;
  const malsukcesojEntute = alsxutRezultoj
    ? alsxutRezultoj.malsukcesaj.length + alsxutRezultoj.ekstrajMalsukcesoj
    : 0;

  return (
    <div>
      <LoadingOverlay show={typeof vicarNumero === "number"} />

      {!alsxutRezultoj && (
        <div>
          <form className="my-4">
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
          {enportEraro && <p className="text-red-500">{enportEraro}</p>}
        </div>
      )}

      {csvTitoloj.length > 0 && (
        <div className="m-2 p-6 ring-1 ring-gray-200 bg-zinc-100 dark:ring-gray-800 dark:bg-zinc-900">
          {alsxutRezultoj ? (
            <div>
              <h4>
                <span className="text-zinc-900 dark:text-zinc-300">
                  Traktitaj: {traktitajEntute}
                </span>
                <span className="text-neutral-500 dark:text-neutral-500 text-lg">
                  {" "}
                  / {datumVicojEntute}
                </span>
              </h4>
              <div className="text-zinc-700 dark:text-zinc-300 mx-2">
                <p className="my-0">Kreitaj: {alsxutRezultoj.kreitaj}</p>
                <p className="my-0">Ignoritaj: {alsxutRezultoj.ignoritaj}</p>
                <p className="my-0">Malsukcesaj: {malsukcesojEntute}</p>
                {malsukcesojEntute > 0 && (
                  <div className="overflow-scroll max-h-64 font-mono h-fit bg-zinc-800 px-4 py-2 text-zinc-300">
                    <div className="mx-2">
                      {alsxutRezultoj.malsukcesaj.map(malsukceso => (
                        <div key={malsukceso.vico}>
                          [Vico {malsukceso.vico}] {malsukceso.termino.trim()}: {malsukceso.kialo}
                        </div>
                      ))}
                    </div>
                    {alsxutRezultoj.ekstrajMalsukcesoj > 0 && (
                      <div>Kaj {alsxutRezultoj.ekstrajMalsukcesoj} aliaj</div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  // alsxutRezultojn(undefined);
                  router.go(0);
                }}
                className="btn btn--style-primary btn--icon-style-without-border btn--size-small btn--icon-position-right"
              >
                Refreŝigi paĝon
              </button>
            </div>
          ) : (
            <>
              <h4 className="my-0">Elektu la respektivajn kolumno-nomojn</h4>
              <form>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                  {Object.values(TerminKampo).map(header => {
                    const formattedHeader =
                      header.length > 2
                        ? header.charAt(0).toUpperCase() + header.slice(1)
                        : header.toUpperCase();
                    const cxuNecesa =
                      header === TerminKampo.Termino || header === TerminKampo.Signifo;
                    return (
                      <div key={header} className="flex flex-col gap-y-1">
                        <p className="mb-0 mx-2">
                          {formattedHeader}
                          {cxuNecesa && <span className="mx-1 text-lg text-red-500">*</span>}
                        </p>
                        <Controller
                          control={titolKontrolilo}
                          name={header}
                          render={({ field: { name, onBlur, onChange, ref, value, disabled } }) => (
                            <Select<{ value: TerminKampo; label: string }>
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
                              required={
                                name === TerminKampo.Termino || name === TerminKampo.Signifo
                              }
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
              {alsxutEraro && <p className="text-red-500">{alsxutEraro}</p>}
              <button
                onClick={() => ekalsxuti()}
                className="btn btn--style-primary btn--icon-style-without-border btn--size-small btn--icon-position-right"
              >
                Alŝuti ĉiujn {datumVicojEntute} terminojn
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CSVEnportilo;

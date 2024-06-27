import { useMutation } from "@tanstack/react-query";
import payloadAPI from "../payloadAPI";
import { TerminKampo } from "../finpunktoj/kreiFinpunkton/helpiloj";
import { Rezulto } from "../../kolektoj/Terminoj/finpunktoj/alsxutiCsv";

const useAlsxutiCsv = ({
  onSuccess,
  onSettled,
  onError,
}: {
  onSuccess?: (data: Rezulto) => void;
  onSettled?: (data: Rezulto | undefined) => void;
  onError?: (
    error: Error,
    variables: {
      kolumnoj: Record<TerminKampo, number | null>;
      vicoj: string[][];
      vicarNumero: number;
      opo: number;
    },
    context: unknown
  ) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      kolumnoj,
      vicoj,
      vicarNumero,
      opo,
    }: {
      kolumnoj: Record<TerminKampo, number | null>;
      vicoj: string[][];
      vicarNumero: number;
      opo: number;
    }) => {
      return await payloadAPI.terminoj.alsxutiCsv({
        kolumnoj,
        vicoj,
        vicarNumero,
        opo,
      });
    },
    onSuccess: async data => {
      onSuccess?.(data);
    },
    onSettled: data => {
      onSettled?.(data);
    },
    onError: (eraro, variabloj, kunteksto) => {
      console.error("Eraro dum alsxuto de CSV-dosiero", eraro);
      onError?.(eraro, variabloj, kunteksto);
    },
  });
};

export default useAlsxutiCsv;

import { useMutation } from "@tanstack/react-query";
import payloadAPI from "../payloadAPI";
import { AldonManiero } from "../finpunktoj/kreiFinpunkton/helpiloj";
import { TerminKampo } from "../finpunktoj/kreiFinpunkton/helpiloj";

const useAlsxutiCsv = ({ onSettled }: { onSettled?: () => void } = {}) => {
  return useMutation({
    mutationFn: async ({ kolumnoj, vicoj }: { kolumnoj: TerminKampo[]; vicoj: string[][] }) => {
      return await payloadAPI.terminoj.alsxutiCsv({
        kolumnoj,
        vicoj,
        maniero: AldonManiero.KreiAuxGxisdatigi,
      });
    },
    onSettled: data => {
      console.log(data);
      onSettled?.();
    },
  });
};

export default useAlsxutiCsv;

import { useMutation } from "@tanstack/react-query";
import payloadAPI from "../payloadAPI";
import { TerminKampo } from "../finpunktoj/kreiFinpunkton/helpiloj";

const useAlsxutiCsv = ({
  onSettled,
}: // postArAlsxuto, // TODO
{ onSettled?: () => void; postArAlsxuto?: () => void } = {}) => {
  return useMutation({
    mutationFn: async ({
      kolumnoj,
      vicoj,
    }: {
      kolumnoj: Record<TerminKampo, number | null>;
      vicoj: string[][];
    }) => {
      return await payloadAPI.terminoj.alsxutiCsv({
        kolumnoj,
        vicoj,
      });
    },
    onSettled: data => {
      console.log(data);
      onSettled?.();
    },
  });
};

export default useAlsxutiCsv;

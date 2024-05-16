import React from "react";
import dayjs from "dayjs";

interface Props {
  collection: {
    slug: string;
  };
  cellData: string;
  link: boolean;
  rowData: { id: string };
}

const Dato = ({ cellData, collection, link, rowData }: Props) => {
  const dato = <div>{dayjs(cellData).format("DD MM YYYY")}</div>;
  return link ? <a href={`/admin/collections/${collection.slug}/${rowData.id}`}>{dato}</a> : dato;
};

export default Dato;

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Edit from "components/driversManagement/Edit";

export default function EditDriver(props) {
  const { editId } = props;

  return <Edit model={false} id={editId} />;
}


// translation ##################################
export async function getServerSideProps({ locale, query }) {
  const { editId } = query
  return {
    props: {
      ...(await serverSideTranslations(locale, ["driversManagement", "main"])),
      editId
    },
  };
}
// translation ##################################

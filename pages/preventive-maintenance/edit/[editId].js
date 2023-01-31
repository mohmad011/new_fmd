import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Edit from "components/preventiveMaintenance/Edit";

const EditPreventive = (props) => {
  const { editId } = props
  return <Edit model={false} id={editId} />;
};

export default EditPreventive;

// translation ##################################
export async function getServerSideProps({ locale, query }) {
  const { editId } = query
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "preventiveMaintenance"])),
      editId
    },
  };
}
// translation ##################################

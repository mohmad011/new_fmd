import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useStreamDataState from "../hooks/useStreamDataState";
import { useSelector } from "react-redux";

// leafletActions
const EditInfo = dynamic(
  () => import("../components/maps/LeaflitActions/EditInfo"),
  {
    loading: () => <header />,
  }
);
const CalibrateMileage = dynamic(
  () => import("../components/maps/LeaflitActions/CalibrateMileage"),
  {
    loading: () => <header />,
  }
);
const CalibrateWeightSetting = dynamic(
  () => import("../components/maps/LeaflitActions/CalibrateWeightSetting"),
  {
    loading: () => <header />,
  }
);
const ShareLocation = dynamic(
  () => import("../components/maps/LeaflitActions/ShareLocation"),
  {
    loading: () => <header />,
  }
);
const DisableVehicle = dynamic(
  () => import("../components/maps/LeaflitActions/DisableVehicle"),
  {
    loading: () => <header />,
  }
);
const EnableVehicle = dynamic(
  () => import("../components/maps/LeaflitActions/EnableVehicle"),
  {
    loading: () => <header />,
  }
);
const SubmitACommand = dynamic(
  () => import("../components/maps/LeaflitActions/SubmitACommand"),
  {
    loading: () => <header />,
  }
);

// const MenuBottom = dynamic(
//   () => import("../components/maps/menu-bottom/index"),
//   {
//     // loading: () => <header />,
//     ssr: false,
//   }
// );
const WidgetMenu = dynamic(() => import("../components/maps/WidgetMenu"), {
  loading: () => <header />,
});
const MapWithNoSSR = dynamic(() => import("../components/maps/vector"), {
  ssr: false,
});

const Map = () => {
  const { trackStreamLoader } = useStreamDataState();
  const { myMap } = useSelector((state) => state.mainMap);

  useEffect(() => {
    trackStreamLoader();
  }, [myMap]);
  return (
    <div id="map" className="mt-5 position-relative">
      <MapWithNoSSR myMap={myMap} />

      <Suspense fallback={"loading"}>
        <WidgetMenu />
      </Suspense>
      {/* <WidgetMenu map={map} /> */}
      {/* <Suspense fallback={"loading"}>
        <MenuBottom />
      </Suspense> */}

      {/* leafletchild actions */}
      <Suspense fallback={"loading"}>
        <EditInfo />
      </Suspense>
      <Suspense fallback={"loading"}>
        <CalibrateMileage />
      </Suspense>
      <Suspense fallback={"loading"}>
        <CalibrateWeightSetting />
      </Suspense>
      <Suspense fallback={"loading"}>
        <ShareLocation />
      </Suspense>
      <Suspense fallback={"loading"}>
        <DisableVehicle />
      </Suspense>
      <Suspense fallback={"loading"}>
        <EnableVehicle />
      </Suspense>
      <Suspense fallback={"loading"}>
        <SubmitACommand />
      </Suspense>
    </div>
  );
};
export default Map;
// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main"])),
    },
  };
}

import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import ManageAccountsIcon from "components/icons/management/ManageAccountsIcon";
import ManageUsersIcon from "components/icons/management/ManageUsersIcon";
import ManageVehiclesIcon from "components/icons/management/ManageVehiclesIcon";
import ManageDevicesIcon from "components/icons/management/ManageDevicesIcon";
import ManageSimIcon from "components/icons/management/ManageSimIcon";
import ManageDriversIcon from "components/icons/management/ManageDriversIcon";
import ManageGroupsIcon from "components/icons/management/ManageGroupsIcon";

const Component = ({
  head = "Manage",
  desc = "To Manage",
  link = "/management/account-management/",
  disabled = false,
  children,
}) => {
  const router = useRouter();
  const { t } = useTranslation("management");
  return (
    <Col lg="6" className="mb-3">
      <Card className="h-100">
        <Card.Body className="py-1">
          <Row className="align-items-center justify-content-center h-100">
            <Col
              xs="3"
              className="d-flex align-items-center justify-item-center"
            >
              {children}
            </Col>
            <Col xs="9">
              <h5 className="mb-2">{t(head)}</h5>
              <p className="mb-3 fs-6">{t(desc)}</p>
              <Button
                onClick={() => {
                  router.push(`${link}`);
                }}
                variant="primary"
                disabled={disabled}
                className="p-2"
              >
                {t(head)}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};
export default function Management() {
  const data = [
    {
      head: "manage_your_accounts_key",
      desc: "to_manage_your_accounts_and_add_new_accounts_click_here_key",
      link: "/management/account-management",
      id: 22,
      disabled: true,
      icon: () => {
        return <ManageAccountsIcon />;
      },
    },
    {
      head: "manage_your_users_key",
      desc: "to_manage_your_users,_add_new_Users,_manage_user's_vehicles_and_edit_users_role_please_click_here_key",
      link: "/management/account-management/ManageUsers",
      disabled: true,
      icon: () => {
        return <ManageUsersIcon />;
      },
    },
    {
      head: "manage_your_vehicles_key",
      desc: "to_manage_your_vehicles_please_click_here_key",
      link: "/management/vehicle-management",
      id: 22,
      icon: () => {
        return <ManageVehiclesIcon />;
      },
    },
    {
      head: "manage_your_devices_key",
      desc: "to_manage_your_devices_and_assign_devices_to_your_vehicle_please_click_here_key",
      link: "/management/device-management",
      id: 22,
      icon: () => {
        return <ManageDevicesIcon />;
      },
    },
    {
      head: "manage_your_sim_cards_key",
      desc: "to_manage_your_sim_cards_please_click_here_key",
      link: "/management/sim-management",
      id: 22,
      icon: () => {
        return <ManageSimIcon />;
      },
    },
    {
      head: "manage_your_drivers_key",
      desc: "to_manage_your_drivers_and_assign_drivers_to_your_vehicle_please_click_here_key",
      link: "/drivers-management",
      id: 22,
      icon: () => {
        return <ManageDriversIcon />;
      },
    },
    {
      head: "manage_your_groups_key",
      desc: "to_manage_your_vehicles_groups_please_click_here_key",
      link: "/management/ManageGroupsVehicles",
      id: 22,
      disabled: true,
      icon: () => {
        return <ManageGroupsIcon />;
      },
    },
  ];
  return (
    <div className="container-fluid">
      <Row>
        {data?.map((ele, i) => {
          return (
            <Component
              key={i}
              head={ele.head}
              desc={ele.desc}
              link={ele.link}
              id={ele.id}
              disabled={ele.disabled}
            >
              {ele.icon()}
            </Component>
          );
        })}
      </Row>
    </div>
  );
}
// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["management", "main"])),
    },
  };
}

// translation ##################################

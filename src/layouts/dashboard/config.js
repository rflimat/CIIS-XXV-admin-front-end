import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import TopicIcon from '@mui/icons-material/Topic';
import EventIcon from '@mui/icons-material/Event';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { SvgIcon } from "@mui/material";
import { AppRegistration } from "@mui/icons-material";

export const vistaAdministrador = [
  {
    title: "Clientes",
    path: "/customer",
    icon: (
      <SvgIcon fontSize="small">
        <AppRegistration />
      </SvgIcon>
    ),
  },
  {
    title: "Usuarios",
    path: "/users",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Ponentes",
    path: "/speakers",
    icon: (
      <SvgIcon fontSize="small">
        <GroupIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Topics",
    path: "/topics",
    icon: (
      <SvgIcon fontSize="small">
        <TopicIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Eventos",
    path: "/events",
    icon: (
      <SvgIcon fontSize="small">
        <EventIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Conferencias",
    path: "/conferences",
    icon: (
      <SvgIcon fontSize="small">
        <SlideshowIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Sponsors",
    path: "/sponsors",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Talleres",
    path: "/taller",
    icon: (
      <SvgIcon fontSize="small">
        <AppRegistration />
      </SvgIcon>
    ),
  },
  {
    title: "Asistencia",
    path: "/attendance",
    icon: (
      <SvgIcon fontSize="small">
        <HowToRegIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Entrega de Kit",
    path: "/kitdelivered",
    icon: (
      <SvgIcon fontSize="small">
        <CardGiftcardIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Inscripción",
    path: "/inscription",
    icon: (
      <SvgIcon fontSize="small">
        <PersonAddIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Perfil",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <AccountBoxIcon />
      </SvgIcon>
    ),
  },
];

export const vistaOrganizador = [
  {
    title: "Asistencia",
    path: "/attendance",
    icon: (
      <SvgIcon fontSize="small">
        <HowToRegIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Perfil",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <AccountBoxIcon />
      </SvgIcon>
    ),
  },
  /* {
    title: "Talleres",
    path: "/taller",
    icon: (
      <SvgIcon fontSize="small">
        <HowToRegIcon />
      </SvgIcon>
    ),
  }, */
];

export const vistaContador = [
  {
    title: "Clientes",
    path: "/customer",
    icon: (
      <SvgIcon fontSize="small">
        <AppRegistration />
      </SvgIcon>
    ),
  },
];

export const vistaGestorContenido = [
  {
    title: "Ponentes",
    path: "/speakers",
    icon: (
      <SvgIcon fontSize="small">
        <GroupIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Conferencias",
    path: "/conferences",
    icon: (
      <SvgIcon fontSize="small">
        <SlideshowIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Sponsors",
    path: "/sponsors",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
];
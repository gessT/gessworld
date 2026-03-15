import {
  IconLayoutDashboard,
  IconPhoto,
  IconUser,
  IconBuildingPavilion,
  IconNotebook,
  IconMap2,
} from "@tabler/icons-react";

interface IconMapProps {
  icon: string;
}

const IconMap = ({ icon }: IconMapProps) => {
  switch (icon) {
    case "dashboard":
      return <IconLayoutDashboard />;
    case "photo":
      return <IconPhoto />;
    case "user":
      return <IconUser />;
    case "city":
      return <IconBuildingPavilion />;
    case "post":
      return <IconNotebook />;
    case "trip":
      return <IconMap2 />;
    default:
      return <IconLayoutDashboard />;
  }
};

export default IconMap;

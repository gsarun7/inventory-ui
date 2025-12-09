import { Notifications } from "@mui/icons-material";
import "./Layout.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-right">
        <Notifications className="icon" />
        <div className="profile">AG</div>
      </div>
    </header>
  );
}

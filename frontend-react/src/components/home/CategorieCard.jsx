import { useNavigate } from "react-router-dom";

function CategorieCard({ icon: Icon, name, filter = 'type' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const categoryMap = {
      Nature: "Nature",
      Mountains: "Nature",
      Historical: "Historic",
      Beaches: "Beach",
      Festivals: "Entertainment",
      Museum: "Museum",
      Adventure: "Adventure",
      Shopping: "Shopping",
      Entertainment: "Entertainment",
      Cultural: "Cultural",
      Religious: "Religious",
    };
    const typeValue = categoryMap[name] || name;
    if (filter === 'city') {
      navigate(`/explore?city=${name}`);
    } else {
      navigate(`/explore?type=${typeValue}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        background: "var(--color-surface)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-full)",
        padding: "10px 20px",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--color-primary)";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = "var(--color-primary)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--color-surface)";
        e.currentTarget.style.color = "var(--color-text-primary)";
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <Icon size={22} />
      {name}
    </button>
  );
}

export default CategorieCard;

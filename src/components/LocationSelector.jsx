import Select from "react-select";

function LocationSelector({ cities, selectedCity, onCityChange, darkMode }) {
  const options = cities.map(city => ({
    value: city.id,
    label: city.lokasi,
  }));

  const customStyles = {
    control: (base) => ({
      ...base,
      background: "transparent",
      border: "none",
      boxShadow: "none",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      background: darkMode ? "#1e293b" : "white", // gelap/terang
      color: darkMode ? "#5eead4" : "#0f766e",
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? "#5eead4" : "#0f766e",
      fontWeight: "600",
      textDecoration: "underline",
    }),
  };

  return (
    <Select
      options={options}
      value={options.find(opt => opt.value === selectedCity)}
      onChange={(opt) => onCityChange(opt.value)}
      styles={customStyles}
      isSearchable
    />
  );
}

export default LocationSelector;

function Favicon({ url }) {
  let hostname;

  try {
    hostname = new URL(url).hostname;
  }
  catch {
    return null;
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

  return (
    <img
      src={faviconUrl}
      alt={hostname}
      className = "bookmark-favicon"
      onError={(e) => {
        e.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}

export default Favicon;

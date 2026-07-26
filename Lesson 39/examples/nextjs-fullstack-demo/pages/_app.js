import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <div className="bg-blob-1" />
      <div className="bg-blob-2" />
      <Component {...pageProps} />
    </>
  );
}

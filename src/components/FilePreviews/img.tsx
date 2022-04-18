export default function (props: {
  file: FileDescription;
  onChange: Function;
  theme: 'light' | 'dark' | 'realdark';
}) {
  const { url } = props.file;
  return (
    <div style={{ textAlign: 'center', margin: '0 auto', overflow: 'scroll' }}>
      <img src={url} alt="" />
    </div>
  );
}

export default function (props: { file: FileDescription; onChange: Function }) {
  const { url } = props.file;
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={url} alt="" />
    </div>
  );
}

export default function (props: { file: FileDescription; onChange: Function }) {
  const { url } = props.file;
  return (
    <div style={{ textAlign: 'center', maxWidth: '80%', margin: '0 auto' }}>
      <img src={url} alt="" />
    </div>
  );
}

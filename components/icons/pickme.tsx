import Image from 'next/image';

export const PickMeIcon = (props: { width: number; height: number }) => {
  const width = props.width * 100;
  const height = props.height * 100;

  return (
    <Image
      src={
        '/brands/pickme.png'
      }
      alt={'Pickme Logo'}
      width={width}
      height={height}
			className="w-full"
    />
  );
};

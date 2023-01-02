import Image from 'next/image';

export const KoombiyoIcon = (props: { width: number; height: number }) => {
  const width = props.width * 100;
  const height = props.height * 100;

  return (
    <Image
      src={'/brands/koombiyo.png'}
      alt={'Koombiyo logo'}
      width={width}
      height={height}
      className="w-full"
    />
  );
};

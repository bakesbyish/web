import NextNProgress from 'nextjs-progressbar';

export const ProgressBar = () => {
  return (
    <NextNProgress
      color="#fb7185"
      height={4}
      options={{ showSpinner: false }}
    />
  );
};

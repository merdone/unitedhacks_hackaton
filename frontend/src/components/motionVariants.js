export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  }),
};

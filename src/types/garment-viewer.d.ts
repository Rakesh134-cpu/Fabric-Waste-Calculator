declare module '@/components/Garment3DViewer' {
  const Garment3DViewer: (props: {
    garmentType?: string;
    fabricUrl?: string | null;
  }) => JSX.Element;

  export default Garment3DViewer;
}

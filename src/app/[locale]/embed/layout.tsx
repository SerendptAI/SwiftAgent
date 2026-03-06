export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { 
          background-color: transparent !important; 
          background: transparent !important; 
          overflow: hidden !important; 
        }
      `,
        }}
      />
      <div className="flex min-h-screen w-full flex-col bg-transparent">
        {children}
      </div>
    </>
  );
}

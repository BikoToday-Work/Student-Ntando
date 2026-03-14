export default function Footer() {
  return (
    <footer className="border-t bg-card py-8">
      <div className="container text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BIFA Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}

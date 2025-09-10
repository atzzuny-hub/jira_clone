import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
		  <Button variant={'primary'} size="lg">Primary</Button>
		  <Button variant={'secondary'} size="sm">Secondary</Button>
		  <Button variant={'destructive'} size="xs">Destructive</Button>
		  <Button variant={'ghost'}>Ghost</Button>
		  <Button variant={'outline'}>Outline</Button>
		  <Button variant={'muted'}>Muted</Button>
		  <Button variant={'tertiary'}>Tertiary</Button>
    </div>
  );
}

import { InstagramIcon } from "@/components/atoms/InstagramIcon";

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 py-16 px-6">
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
                <h3 className="font-serif text-3xl mb-8 tracking-widest">JANMIRA</h3>

                <div className="flex gap-8 mb-12">
                    <a href="#" className="text-zinc-500 hover:text-gold transition-colors text-sm uppercase tracking-widest">Collection</a>
                    <a href="#" className="text-zinc-500 hover:text-gold transition-colors text-sm uppercase tracking-widest">Story</a>
                    <a href="#" className="text-zinc-500 hover:text-gold transition-colors text-sm uppercase tracking-widest">Contact</a>
                </div>

                <div className="mb-12">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-white hover:border-gold hover:text-gold transition-all duration-300"
                    >
                        <InstagramIcon className="w-5 h-5" />
                    </a>
                </div>

                <div className="text-zinc-600 text-xs tracking-widest">
                    &copy; {new Date().getFullYear()} JANMIRA. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}

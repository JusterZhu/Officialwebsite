"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

import justerImage from "@/assets/images/juster.png";
import spacestationImage from "@/assets/images/sapcestation.png";
import bowlImage from "@/assets/images/bowl.png";
import FloatingButton from "./FloatingButton";
import Navbar from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

const frameCount = 460;
const frameSrc = (index) => `/frames/${String(index + 1).padStart(3, "0")}.png`;
const sectionImages = {
    juster: justerImage,
    spacestation: spacestationImage,
    bowl: bowlImage,
};

function RichText({ text }) {
    const parts = [];
    const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        parts.push(
            <a key={`${match[1]}-${match.index}`} href={match[2]} target="_blank" rel="noreferrer" className="text-white underline underline-offset-4 transition hover:text-white/75">
                {match[1]}
            </a>,
        );
        lastIndex = linkPattern.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

function MarkdownBlocks({ blocks }) {
    return (
        <div className="space-y-5 text-sm leading-7 text-white/68 regular">
            {blocks.map((block, index) => {
                if (block.type === "heading") {
                    return <h3 key={index} className="pt-2 text-lg text-white extended">{block.text}</h3>;
                }

                if (block.type === "list") {
                    return (
                        <ul key={index} className="grid gap-3 md:grid-cols-2">
                            {block.items.map((item) => (
                                <li key={item} className="border-l border-white/20 pl-4 text-white/72"><RichText text={item} /></li>
                            ))}
                        </ul>
                    );
                }

                return <p key={index}><RichText text={block.text} /></p>;
            })}
        </div>
    );
}

function CorporateSection({ section, index }) {
    const sectionImage = sectionImages[section.image];
    const headingSize = section.id === "product-showcase"
        ? "max-w-xl break-words text-3xl leading-tight text-white md:text-5xl"
        : "max-w-2xl text-4xl leading-tight text-white md:text-6xl";

    return (
        <section id={section.id} className="corporate-section relative overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_32rem)] opacity-60" />
            <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <p className="mb-8 text-[10px] uppercase tracking-[0.45em] text-white/45">0{index + 1} / {section.eyebrow}</p>
                    <h2 className={headingSize}>{section.title}</h2>
                    {sectionImage && (
                        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30">
                            <Image src={sectionImage} alt={section.title} className="h-auto w-full object-cover" />
                        </div>
                    )}
                </div>
                <div className="space-y-10">
                    <p className="text-xl leading-9 text-white/80 regular">{section.summary}</p>
                    {Array.isArray(section.metrics) && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {section.metrics.map((metric) => (
                                <div key={metric} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm text-white/78 backdrop-blur-md">
                                    {metric}
                                </div>
                            ))}
                        </div>
                    )}
                    <MarkdownBlocks blocks={section.blocks} />
                </div>
            </div>
        </section>
    );
}

const SmoothScrollHero = ({ content }) => {
    const [locale, setLocale] = useState("en");
    const canvasRef = useRef(null);
    const animationScopeRef = useRef(null);
    const mainContainer = useRef(null);
    const heroCopyRef = useRef(null);
    const introRef = useRef(null);
    const logoRef = useRef(null);
    const imageCache = useRef(new Map());
    const currentFrame = useRef({ value: 0 });
    const drawFrameRef = useRef(() => { });

    const activeContent = content[locale];
    const labels = activeContent.labels;
    const heroTitleSize = locale === "en"
        ? "max-w-4xl text-4xl leading-none tracking-tight sm:text-6xl lg:text-[82px] xl:text-[92px]"
        : "max-w-5xl text-5xl leading-none tracking-tight sm:text-7xl lg:text-[112px]";

    const firstFrames = useMemo(
        () => Array.from({ length: 18 }, (_, index) => frameSrc(index)),
        [],
    );

    useEffect(() => {
        firstFrames.forEach((src) => {
            const image = new window.Image();
            image.src = src;
        });
    }, [firstFrames]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        let cancelled = false;
        let currentRequest = 0;

        const sizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const drawImage = (image) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
            const x = (width - image.naturalWidth * scale) / 2;
            const y = (height - image.naturalHeight * scale) / 2;

            context.clearRect(0, 0, width, height);
            context.drawImage(image, x, y, image.naturalWidth * scale, image.naturalHeight * scale);
        };

        const loadFrame = (index) => {
            const normalized = Math.min(frameCount - 1, Math.max(0, Math.round(index)));
            const cached = imageCache.current.get(normalized);

            if (cached?.complete) {
                drawImage(cached);
                return;
            }

            const request = ++currentRequest;
            const image = cached || new window.Image();
            image.decoding = "async";
            image.src = frameSrc(normalized);
            imageCache.current.set(normalized, image);

            image.onload = () => {
                if (!cancelled && request === currentRequest) {
                    drawImage(image);
                }
            };

            for (let next = normalized + 1; next <= Math.min(frameCount - 1, normalized + 5); next += 1) {
                if (!imageCache.current.has(next)) {
                    const preload = new window.Image();
                    preload.decoding = "async";
                    preload.src = frameSrc(next);
                    imageCache.current.set(next, preload);
                }
            }
        };

        drawFrameRef.current = loadFrame;
        sizeCanvas();
        loadFrame(0);

        window.addEventListener("resize", sizeCanvas);

        return () => {
            cancelled = true;
            window.removeEventListener("resize", sizeCanvas);
            drawFrameRef.current = () => { };
        };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: mainContainer.current,
                start: "top top",
                end: "+=420%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        tl.to(currentFrame.current, {
            value: frameCount - 1,
            snap: "value",
            ease: "none",
            duration: 10,
            onUpdate: () => drawFrameRef.current(currentFrame.current.value),
        }, 0)
            .to(canvasRef.current, {
                scale: 1.08,
                duration: 10,
                ease: "power2.inOut",
            }, 0)
            .to(heroCopyRef.current, {
                y: -90,
                opacity: 0,
                scale: 0.94,
                duration: 4,
                ease: "power2.in",
            }, 1)
            .to(".scroll-indicator", { opacity: 0, duration: 1 }, 0)
            .to(logoRef.current, {
                y: -window.innerHeight * 0.43,
                scale: 0.62,
                duration: 7,
                ease: "power2.inOut",
            }, 1.5)
            .fromTo(introRef.current,
                { opacity: 0, y: 130, scale: 0.9, filter: "blur(12px)" },
                { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 6, ease: "power3.out" },
                5,
            );

        gsap.utils.toArray(".corporate-section").forEach((section) => {
            gsap.fromTo(section,
                { y: 80, opacity: 0.55 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 82%",
                        end: "top 45%",
                        scrub: 1,
                    },
                },
            );
        });
    }, { scope: animationScopeRef });

    return (
        <div ref={animationScopeRef} className="relative min-h-screen bg-[#050608] text-white">
            <Navbar navLinks={labels.nav} currentLocale={locale} onLocaleChange={setLocale} />
            <FloatingButton label={labels.inquiry} />

            <div ref={mainContainer} className="relative h-screen overflow-hidden bg-black">
                <Image
                    src={frameSrc(0)}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                    aria-hidden="true"
                />
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full will-change-transform" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.58)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/78" />
                <div className="pixel-meteor-layer" aria-hidden="true" />

                <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none">
                    <div
                        ref={logoRef}
                        className="text-center text-4xl font-semibold tracking-[0.28em] text-white drop-shadow-2xl sm:text-6xl lg:text-7xl"
                    >
                        TSLH AI
                    </div>
                </div>

                <div ref={heroCopyRef} className="absolute inset-0 z-20 flex items-end px-6 pb-28 sm:px-10 lg:px-16 lg:pb-24">
                    <div className="grid w-full items-end gap-8 lg:grid-cols-[1fr_0.75fr]">
                        <div>
                            <p className="mb-6 text-[10px] uppercase tracking-[0.55em] text-white/55">{labels.heroKicker}</p>
                            <h1 className={heroTitleSize}>
                                {labels.heroTitle}
                            </h1>
                        </div>
                        <p className="max-w-xl justify-self-end text-base leading-8 text-white/72 regular lg:text-right">
                            {labels.heroSubtitle}
                        </p>
                    </div>
                </div>

                <div className="scroll-indicator absolute bottom-10 right-6 z-20 w-[calc(100%-3rem)] max-w-md text-white sm:right-10 lg:right-16">
                    <div className="mb-4 h-px w-full bg-white/70" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[9px] font-bold tracking-tight">
                            <div className="flex flex-col -space-y-2">
                                <ChevronDown size={15} />
                                <ChevronDown size={15} className="-mt-[11px]" />
                                <ChevronDown size={15} className="-mt-[11px]" />
                            </div>
                            <span>{labels.scroll}</span>
                        </div>
                        <p className="text-[9px] tracking-tight text-white/72">{labels.journey}</p>
                    </div>
                </div>

                <div ref={introRef} className="absolute inset-0 z-30 flex items-center px-6 opacity-0 sm:px-10 lg:px-16">
                    <h2 className="max-w-6xl text-3xl leading-tight text-white sm:text-5xl lg:text-[64px]">
                        {labels.intro}
                    </h2>
                </div>
            </div>

            <main className="relative z-10 bg-[#050608]">
                {activeContent.sections.map((section, index) => (
                    <CorporateSection key={section.id} section={section} index={index} />
                ))}
            </main>

            <footer className="border-t border-white/10 bg-black px-6 py-10 text-center text-xs uppercase tracking-[0.35em] text-white/45">
                {labels.footer}
            </footer>
        </div>
    );
};

export default SmoothScrollHero;

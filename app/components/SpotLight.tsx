"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PANEL_WIDTH_COLLAPSED = 20;
const PANEL_WIDTH_EXPANDED = 400;
const PANEL_WIDTH_EXPANDED_MOBILE = 100;
const PANEL_GAP = 5;
const PANEL_COUNT_DESKTOP = 20;
const PANEL_COUNT_MOBILE = 10;
const BREAKPOINT_MOBILE = 1000;

type PanelPosition = {
    left: number;
    width: number;
};

export default function SpotLight() {
    const trackRef = useRef<HTMLDivElement | null>(null);

    const [trackWidth, setTrackWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [focusedPanel, setFocusedPanel] = useState(0);

    const panelCount = isMobile ? PANEL_COUNT_MOBILE : PANEL_COUNT_DESKTOP;

    const expandedWidth = isMobile
        ? PANEL_WIDTH_EXPANDED_MOBILE
        : PANEL_WIDTH_EXPANDED;

    // Watch the gallery width and detect mobile screens.
    useEffect(() => {
        const updateLayout = () => {
            setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
        };

        updateLayout();

        const observer = new ResizeObserver(([entry]) => {
            setTrackWidth(entry.contentRect.width);
        });

        if (trackRef.current) {
            observer.observe(trackRef.current);
        }

        window.addEventListener("resize", updateLayout);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateLayout);
        };
    }, []);

    // Reset the active panel if the number of panels changes.
    useEffect(() => {
        setFocusedPanel(0);
    }, [panelCount]);

    // Calculate each panel's position.
    const getPanelPosition = useCallback(
        (panelIndex: number): PanelPosition => {
            const totalTrackWidth =
                (panelCount - 1) * (PANEL_WIDTH_COLLAPSED + PANEL_GAP) +
                expandedWidth;

            const offsetToCenter = (trackWidth - totalTrackWidth) / 2;

            let left = offsetToCenter;

            for (let i = 0; i < panelIndex; i++) {
                const width =
                    i === focusedPanel ? expandedWidth : PANEL_WIDTH_COLLAPSED;

                left += width + PANEL_GAP;
            }

            const width =
                panelIndex === focusedPanel
                    ? expandedWidth
                    : PANEL_WIDTH_COLLAPSED;

            return { left, width };
        },
        [focusedPanel, panelCount, expandedWidth, trackWidth],
    );

    const focusPanel = useCallback((index: number) => {
        setFocusedPanel(index);
    }, []);

    const focusIndicatorPosition = getPanelPosition(focusedPanel);

    return (
        <section className="spotlight">
            {/* Victorian editorial heading */}
            <header className="spotlight-header">
                <p className="spotlight-eyebrow">
                    A photographic collection · Est. #romantic
                </p>

                <h1 className="spotlight-title">
                    The Art of
                    <br />
                    <em>Being in Love</em>
                </h1>

                <p className="spotlight-subtitle">
                    Portraits, memories &amp; forgotten romances
                </p>
            </header>

            {/* Interactive photograph gallery */}
            <div className="spotlight-track" ref={trackRef}>
                <div className="spotlight-panels">
                    <div
                        className="spotlight-focus-indicator"
                        style={focusIndicatorPosition}
                    >
                        <span className="spotlight-ornament spotlight-ornament--top">
                            ✦
                        </span>

                        <span className="spotlight-ornament spotlight-ornament--bottom">
                            ✦
                        </span>
                    </div>

                    {Array.from({ length: panelCount }, (_, i) => (
                        <div
                            key={`${isMobile ? "m" : "d"}-${i}`}
                            className="spotlight-panel"
                            style={getPanelPosition(i)}
                            onMouseEnter={
                                !isMobile ? () => focusPanel(i) : undefined
                            }
                            onClick={isMobile ? () => focusPanel(i) : undefined}
                        >
                            <img
                                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/${i + 1}.jpg`}
                                alt={`Romantic archival portrait ${i + 1}`}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Archival details */}
            <footer className="spotlight-footer">
                <span>Volume I · No. 001–{panelCount}</span>

                <span className="spotlight-footer-center">
                    Forever, in a photograph
                </span>

                <span>Private Collection · #467</span>
            </footer>
        </section>
    );
}

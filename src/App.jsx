import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  GlobalCanvas,
  SmoothScrollbar,
  UseCanvas,
} from "@14islands/r3f-scroll-rig";
import { Environment, Loader, RoundedBox } from "@react-three/drei";
import { BodyCopy, Headline, Subtitle } from "./Text";
import { Image } from "./Image";
import { ImageCube } from "./ImageCube";
import { WebGLBackground } from "./WebGLBackground";
import { Lens } from "./Lens";
import "@14islands/r3f-scroll-rig/css";
import Logo from "./Logo";
import { StickyScrollScene } from "@14islands/r3f-scroll-rig/powerups";
import { useFrame } from "@react-three/fiber";
import "./style.css";
import { a, config, useSpring } from "@react-spring/three";

const AnimatedRoundedBox = a(RoundedBox);
function StickySection() {
  const el = useRef();
  return (
    <section>
      <div className="StickyContainer">
        <div ref={el} className="SomeDomContent"></div>
      </div>
      <UseCanvas>
        <StickyScrollScene track={el}>
          {(props) => (
            <>
              <SpinningBox {...props} />
            </>
          )}
        </StickyScrollScene>
      </UseCanvas>
    </section>
  );
}

function SpinningBox({ scale, scrollState, inViewport }) {
  const box = useRef();
  const size = scale.xy.min() * 0.5;

  useFrame(() => {
    box.current.rotation.y = scrollState.progress * Math.PI * 2;
  });

  const spring = useSpring({
    scale: inViewport ? size : size * 0.0,
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 100 : 0,
  });

  return (
    <AnimatedRoundedBox ref={box} {...spring}>
      <meshNormalMaterial />
    </AnimatedRoundedBox>
  );
}
export default function App() {
  const eventSource = useRef();
  const [enabled, setEnabled] = useState(true);
  const [isTouch, setTouch] = useState(false);
  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
    setTouch(isTouch);
  }, []);

  return (
    // We attach events onparent div in order to get events on both canvas and DOM
    <div ref={eventSource}>
      <GlobalCanvas
        // shader errors are hidden by default which speeds up compilation
        debug={false}
        // scaleMultiplier is a scroll-rig setting to scale the entire scene
        scaleMultiplier={0.01}
        // All other props on the R3F Canvas is supported:
        eventSource={eventSource}
        eventPrefix="client"
        flat // disable toneMapping since we have editorial images
        camera={{ fov: 14 }}
        style={{ pointerEvents: "none", zIndex: -1 }}
      >
        {(globalChildren) => (
          <Lens>
            <WebGLBackground />
            <Suspense fallback="">
              {/* 
                Our materials use PBR ligting and requires an environment
              */}
              <Environment files="env/empty_warehouse_01_1k.hdr" />
              {globalChildren}
            </Suspense>
          </Lens>
        )}
      </GlobalCanvas>

      <article>
        <header className="container">
          <div className="headerLayout">
            <h2>
              <Headline wobble>
                RESPONSIVE {enabled ? "WEBGL" : "HTML"}
              </Headline>
            </h2>
            <BodyCopy as="p" className="subline">
              Progressively enhance your React website with WebGL using
              r3f-scroll-rig, React Three Fiber and Three.js
            </BodyCopy>
          </div>
        </header>

        <section className="container">
          <h3>
            <Subtitle>We use CSS to create a responsive layout.</Subtitle>
            <em>
              <Subtitle>
                A Canvas on top tracks DOM elements and enhance them with WebGL.
              </Subtitle>
            </em>
          </h3>
        </section>

        <section>
          <ImageCube
            src="images/maxim-berg-TcE45yIzJA0-unsplash.jpg"
            className="JellyPlaceholder"
          />
        </section>
        <SmoothScrollbar
          enabled={true}
          config={{ syncTouch: true }} // Lenis setting to force smooth scroll on touch devices
        >
          {(bind) => (
            <article {...bind}>
              {isTouch && (
                <section>
                  <p style={{ color: "orange" }}>
                    You are on a touch device which means the WebGL won't sync
                    with the native scroll. Consider disabling ScrollScenes for
                    touch devices, or experiment with the `smoothTouch` setting
                    on Lenis.
                  </p>
                </section>
              )}
              <StickySection />
              <Logo />
              <Logo />
              <Logo />
              <Logo />
              <Logo />
            </article>
          )}
        </SmoothScrollbar>
      </article>

      <Loader
        containerStyles={{
          background: "transparent",
          top: "auto",
          bottom: 0,
          height: "5px",
        }}
        innerStyles={{ background: "white", width: "100vw", height: "5px" }}
        barStyles={{ background: "#6e6bcd", height: "100%" }}
      />
    </div>
  );
}

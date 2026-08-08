import React from "react";
import Svg, { Path } from "react-native-svg";

export default function MailIcon({ size = 20, color = "#6a5cff" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 4h16v16H4z" />
      <Path d="m4 6 8 7 8-7" />
    </Svg>
  );
}

"use client";

import { Spin } from "antd";

export default function Loading() {
  return (
    <div style={{ textAlign: "center", padding: 48 }}>
      <Spin size="large" />
    </div>
  );
}

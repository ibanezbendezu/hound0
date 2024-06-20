"use client"

import React from "react";
import G6 from "@antv/g6";
import {
  Rect,
  Text,
  Circle,
  Image,
  Group,
  createNodeFromReact
} from "@antv/g6-react-node";

const Tag = ({ text, color }) => (
  <Rect
    style={{
      fill: color,
      padding: [5, 10],
      width: "auto",
      radius: [4],
      margin: [0, 8]
    }}
  >
    <Text style={{ fill: "#fff", fontSize: 10 }}>{text}</Text>
  </Rect>
);

const Card = ({ cfg }) => {
  console.log(123, cfg);
  const { collapsed = true } = cfg;

  return (
    <Group draggable name={"card-edit"}>
      <Rect
        style={{
          width: 400,
          height: "auto",
          fill: "#fff",
          stroke: "#ddd",
          shadowColor: "#eee",
          shadowBlur: 30,
          radius: [8],
          justifyContent: "center",
          padding: [18, 0]
        }}
        draggable
      >
        <Text
          style={{
            fill: "#000",
            margin: [0, 24],
            fontSize: 16,
            fontWeight: "bold"
          }}
        >
          这是一个卡片
        </Text>
        <Text style={{ fill: "#ccc", fontSize: 12, margin: [12, 24] }}>
          我是一段特别特别特别特别特别特别特别长的描述
        </Text>
        {collapsed && (
          <Group>
            <Image
              style={{
                img:
                  "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
                width: 200,
                height: 200,
                margin: [24, "auto"]
              }}
            />
            <Rect
              style={{ width: "auto", flexDirection: "row", padding: [4, 12] }}
            >
              <Rect
                style={{
                  height: 30,
                  display: "flex",
                  flexDirection: "row"
                }}
              >
                <Text
                  style={{
                    margin: 8,
                    fontWeight: "bold",
                    fontSize: 12,
                    fill: "#000"
                  }}
                >
                  类型
                </Text>
                <Group style={{ flex: 1 }} />
                <Text
                  style={{
                    margin: 8,
                    fontSize: 12,
                    fill: "#000"
                  }}
                >
                  未知类型
                </Text>
              </Rect>
              {cfg.objectData &&
                cfg.objectData.paramValue.length > 0 &&
                cfg.objectData.paramValue.map((item, i) => (
                  // <Tag key={i} color="#66ccff" text={item} />
                  <Rect
                    style={{
                      fill: "#66ccff",
                      padding: [5, 10],
                      width: "auto",
                      radius: [4],
                      margin: [0, 8]
                    }}
                  >
                    <Text style={{ fill: "#fff", fontSize: 10 }}>
                      {item.name}
                    </Text>
                  </Rect>
                ))}
            </Rect>
          </Group>
        )}
        <Circle
          style={{
            position: "absolute",
            x: 380,
            y: 20,
            r: 5,
            fill: collapsed ? "blue" : "green"
          }}
        >
          <Text
            style={{
              fill: "#fff",
              fontSize: 10,
              margin: [-6, -3, 0],
              cursor: "pointer"
            }}
            onClick={(evt, node, shape, graph) => {
              graph.updateItem(node, {
                collapsed: !collapsed
              });
            }}
          >
            {collapsed ? "-" : "+"}
          </Text>
        </Circle>
      </Rect>
    </Group>
  );
};

G6.registerNode("test", createNodeFromReact(Card), "rect");

const data = {
  description: "ant_type_name_...",
  label: "Type / ReferType",
  color: "#2196f3",
  meta: {
    creatorName: "a_creator"
  },
  id: "node" + 1,
  type: "test",
  tags: [
    { name: "我是", ids: 1 },
    { name: "很多个", ids: 2 },
    { name: "很多个的", ids: 3 },
    { name: "标签啊啊啊啊啊啊", ids: 4 }
  ],
  objectData: {
    _id: "614adc0a751ab133cc4df837",
    sceneId: "6053121633cc3406e120cd64",
    sceneContainerId: "60754af53ba76c0712bdd5d5",
    interfaceType: "setText",
    repeatTime: null,
    itemInfType: null,
    index: 0,
    iState: "normal",
    paramValue: [
      {
        type: "const CGString&",
        name: "name",
        isThrow: true,
        canEdit: true,
        defaultValue: "defalutStr",
        value: "asdfasdf"
      },
      {
        type: "int",
        name: "name",
        isThrow: true,
        canEdit: true,
        defaultValue: "0",
        value: "0"
      },
      {
        type: "float",
        name: "name",
        isThrow: true,
        canEdit: true,
        defaultValue: "0",
        value: "0"
      }
    ]
  },
  children: []
};

const container = document.getElementById("root");
const width = container.scrollWidth;
const height = 500;
const graph = new G6.TreeGraph({
  container: "root",
  width,
  height,
  fitCenter: true,
  modes: {
    default: ["drag-node", "zoom-canvas"]
  },
  layout: {
    type: "indented",
    direction: "LR"
  }
});
// appenAutoShapeListener(graph);
// const a = +new Date();
graph.data(data);
graph.render();

"use client";

import { useMemo, useRef, useEffect, useState, use } from "react";
import { Tree, findNode } from "./tmdata3";
import * as d3 from "d3";
import { scaleLinear } from 'd3-scale';
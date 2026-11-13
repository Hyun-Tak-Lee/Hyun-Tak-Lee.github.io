import type {
  ArchitectureData,
  ArchitectureEdge,
  ArchitectureFragment,
  ArchitectureGroup,
  ArchitectureNode,
} from "../../content.config";

export interface ConnectedPeer {
  nodeId: string;
  nodeTitle: string;
  groupLabel: string;
  edgeLabel?: string;
  bidirectional?: boolean;
}

export interface EnrichedArchitectureNode extends ArchitectureNode {
  groupLabel: string;
  inbounds: ConnectedPeer[];
  outbounds: ConnectedPeer[];
}

export interface ArchitectureGroupWithNodes extends ArchitectureGroup {
  items: EnrichedArchitectureNode[];
}

export interface ArchitectureGraphModel {
  summary?: string;
  groups: ArchitectureGroup[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  groupedNodes: ArchitectureGroupWithNodes[];
  enrichedNodes: EnrichedArchitectureNode[];
  defaultNodeId: string;
}

/**
 * 단일 architecture.yaml 또는 도메인별로 분할된 architecture/*.yaml 조각들을
 * 하나의 ArchitectureData 토폴로지로 병합한다.
 */
export function mergeArchitectureFragments(
  fragments: Array<{ id: string; data: ArchitectureFragment }>,
  inlineArchitecture?: ArchitectureData,
): ArchitectureData | undefined {
  if (fragments.length === 0) {
    return inlineArchitecture;
  }

  const sorted = [...fragments].sort((a, b) => {
    const orderDiff = (a.data.order ?? 999) - (b.data.order ?? 999);
    if (orderDiff !== 0) return orderDiff;
    return a.id.localeCompare(b.id);
  });

  let summary = inlineArchitecture?.summary;
  const groupMap = new Map<string, ArchitectureGroup>();
  const nodeMap = new Map<string, ArchitectureNode>();
  const edges: ArchitectureEdge[] = [...(inlineArchitecture?.edges ?? [])];

  for (const group of inlineArchitecture?.groups ?? []) {
    groupMap.set(group.id, group);
  }
  for (const node of inlineArchitecture?.nodes ?? []) {
    nodeMap.set(node.id, node);
  }

  for (const fragment of sorted) {
    if (!summary && fragment.data.summary) {
      summary = fragment.data.summary;
    }
    for (const group of fragment.data.groups ?? []) {
      groupMap.set(group.id, group);
    }
    for (const node of fragment.data.nodes ?? []) {
      nodeMap.set(node.id, node);
    }
    if (fragment.data.edges) {
      edges.push(...fragment.data.edges);
    }
  }

  const groups = Array.from(groupMap.values());
  const nodes = Array.from(nodeMap.values());

  if (groups.length === 0 && nodes.length === 0) {
    return undefined;
  }

  return {
    summary,
    groups,
    nodes,
    edges,
  };
}

/**
 * 아키텍처 원본 데이터로부터 그룹별 노드 목록과 입·출력(Upstream/Downstream) 연결 맵을 계산한다.
 */
export function buildArchitectureGraphModel(
  architecture: ArchitectureData,
): ArchitectureGraphModel {
  const groups = architecture.groups ?? [];
  const nodes = architecture.nodes ?? [];
  const edges = architecture.edges ?? [];

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const groupMap = new Map(groups.map((group) => [group.id, group]));

  const inboundMap = new Map<string, ConnectedPeer[]>();
  const outboundMap = new Map<string, ConnectedPeer[]>();

  nodes.forEach((node) => {
    inboundMap.set(node.id, []);
    outboundMap.set(node.id, []);
  });

  edges.forEach((edge) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return;

    const fromGroup = groupMap.get(fromNode.group)?.label ?? fromNode.group;
    const toGroup = groupMap.get(toNode.group)?.label ?? toNode.group;

    outboundMap.get(edge.from)?.push({
      nodeId: toNode.id,
      nodeTitle: toNode.title,
      groupLabel: toGroup,
      edgeLabel: edge.label,
      bidirectional: edge.bidirectional,
    });

    inboundMap.get(edge.to)?.push({
      nodeId: fromNode.id,
      nodeTitle: fromNode.title,
      groupLabel: fromGroup,
      edgeLabel: edge.label,
      bidirectional: edge.bidirectional,
    });

    if (edge.bidirectional) {
      outboundMap.get(edge.to)?.push({
        nodeId: fromNode.id,
        nodeTitle: fromNode.title,
        groupLabel: fromGroup,
        edgeLabel: edge.label,
        bidirectional: true,
      });

      inboundMap.get(edge.from)?.push({
        nodeId: toNode.id,
        nodeTitle: toNode.title,
        groupLabel: toGroup,
        edgeLabel: edge.label,
        bidirectional: true,
      });
    }
  });

  const groupedNodes: ArchitectureGroupWithNodes[] = groups.map((group) => ({
    ...group,
    items: nodes
      .filter((node) => node.group === group.id)
      .map((node) => ({
        ...node,
        groupLabel: group.label,
        inbounds: inboundMap.get(node.id) ?? [],
        outbounds: outboundMap.get(node.id) ?? [],
      })),
  }));

  const enrichedNodes: EnrichedArchitectureNode[] = nodes.map((node) => ({
    ...node,
    groupLabel: groupMap.get(node.group)?.label ?? node.group,
    inbounds: inboundMap.get(node.id) ?? [],
    outbounds: outboundMap.get(node.id) ?? [],
  }));

  return {
    summary: architecture.summary,
    groups,
    nodes,
    edges,
    groupedNodes,
    enrichedNodes,
    defaultNodeId: nodes[0]?.id ?? "",
  };
}


# FlowChat

FlowChat is a "Bring Your Own Key" (BYOK) AI chat application featuring a node-based flow interface. It allows users to visually design and execute complex chat flows while maintaining complete control over their API keys and data.

## 🚀 Features

- **Node-Based Interface**: Design chat logic visually using a drag-and-drop canvas powered by [@xyflow/react](https://github.com/xyflow/xyflow).
- **Bring Your Own Key (BYOK)**: Securely manage your own AI provider API keys locally.
- **Local-First Architecture**: Your flows, sessions, and messages are stored safely in your browser using IndexedDB (via [Dexie.js](https://dexie.org/)).
- **Branching Conversations**: Create complex conversation paths with conditional logic and multiple outcomes.
- **Recursive Execution Engine**: A robust backend logic that traverses your flow designs to provide a seamless chat experience.

---

## 🏗 Architecture

FlowChat follows a modular, local-first architecture to ensure speed, privacy, and extensibility.

```mermaid
graph TD
    subgraph "UI Layer (React/Next.js)"
        Canvas["ChatFlowCanvas (@xyflow/react)"]
        Sidebar["FlowSidebar"]
        NodeUI["NodeContainer"]
    end

    subgraph "State Management (Zustand)"
        FlowStore["useFlowStore (Nodes/Edges)"]
        ExecStore["useExecutionStore (Messages/Active Node)"]
        SettingsStore["useSettingsStore (API Keys)"]
    end

    subgraph "Logic Layer"
        Engine["Execution Engine (engine.ts)"]
        LLM["LLM Interface (llm.ts)"]
    end

    subgraph "Persistence Layer (IndexedDB)"
        Dexie["Dexie.js DB"]
        FlowsTable[("flows")]
        SessionsTable[("sessions")]
        MessagesTable[("messages")]
        SettingsTable[("settings")]
    end

    %% Interactions
    Canvas --> FlowStore
    NodeUI --> FlowStore
    Engine --> FlowStore
    Engine --> ExecStore
    Engine --> LLM
    ExecStore --> Dexie
    FlowStore --> Dexie
    LLM --> SettingsStore
    Dexie --> FlowsTable
    Dexie --> SessionsTable
    Dexie --> MessagesTable
    Dexie --> SettingsTable
```

---

## 📊 Data Model (ERD)

The application uses a relational-style schema on top of IndexedDB to manage complex flow templates and their respective runtime sessions.

```mermaid
erDiagram
    FLOW ||--o{ SESSION : "initiates"
    SESSION ||--o{ MESSAGE : "contains"
    FLOW {
        string id PK
        string name
        json nodes "Serialized @xyflow/react nodes"
        json edges "Serialized @xyflow/react edges"
        timestamp createdAt
        timestamp updatedAt
    }
    SESSION {
        string id PK
        string flowId FK
        string status "active | completed | archived"
        json currentVariables
        timestamp createdAt
    }
    MESSAGE {
        string id PK
        string sessionId FK
        string nodeId "The node that generated this message"
        string role "user | assistant | system"
        string content
        timestamp timestamp
    }
    SETTING {
        string key PK
        string value
    }
```

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **UI & Interaction**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [@xyflow/react](https://reactflow.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd flowchat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

[MIT](LICENSE)

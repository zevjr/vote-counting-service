# Documentation Rules

All generated code must include accompanying technical documentation.

Each implementation phase must produce a documentation file describing what was created, how it works, and how future agents should interact with it.

Documentation must be written for AI agents and developers.

---

# Documentation Location

Each major project area must contain a local documentation file.

Examples:

frontend/docs/
backend/docs/
infra/docs/

The documentation must describe the implementation of that specific module.

---

# Implementation Report

After completing a task, the agent must create a report describing the implementation.

Location:

docs/implementation/

File name format:

phase_<number>_<short_name>.md

Example:

docs/implementation/phase_01_frontend_prototype.md

---

# Documentation Goals

Documentation must allow a future AI agent to understand:

- what was implemented
- the structure of the code
- how components interact
- where important files are located
- how to extend the system safely

The documentation must prioritize clarity over verbosity.

---

# Required Sections

Each implementation document must contain the following sections.

## Overview

Short description of what was implemented in this phase.

## Architecture Decisions

Key decisions made during implementation.

Explain why those decisions were chosen.

## Folder Structure

Explain the folder structure created.

Include a tree representation of the project.

## Key Components

Describe the most important components created.

Example:

pages  
services  
state management  
routing

## Data Model (if applicable)

Explain the data structures used.

Example:

mock datasets  
interfaces  
types

## How to Extend

Explain how future agents should extend the code safely.

Examples:

how to add new pages  
how to add new API integrations  
how to modify components

## Known Limitations

Explicitly describe what is NOT implemented yet.

Example:

no backend integration  
mocked data only

## Next Suggested Steps

Recommend the next development phase.

---

# Documentation Style

Documentation must be:

- clear
- structured
- concise
- technically precise

Avoid unnecessary narrative text.

Focus on structural understanding.
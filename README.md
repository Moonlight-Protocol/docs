# Moonlight

## Welcome!

This is Moonlight's documentation page. Your place for all things related to the Moonlight protocol — a privacy layer built on [Stellar](https://www.stellar.org/).



## What is Moonlight?

Moonlight is a privacy layer for the Stellar network that lets people send, receive, and store assets without revealing on-chain who owns what. By spreading each account across countless discrete addresses and processing transfers in bundled form through a user-chosen privacy provider, it breaks the direct link between public ledger data and personal identity—letting providers meet regulation-specific requirements while users retain **complete control of their funds** and **the freedom to choose or switch their privacy provider at any moment.**

Moonlight provides fully open-sourced core building blocks for the protocol to operate. Accounts are represented by countless discrete UTXO addresses that the wallet still treats as one balance, and a standardized key-derivation scheme lets a single master secret deterministically generate, control, and recover every address. Transactions move through programmable channels overseen by trusted privacy providers, who manage these pools, uphold compliance requirements, and deliver a seamless, unified experience for users interacting with the protocol.

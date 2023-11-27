import express from "express";

type ContextRequest = express.Request | Request;

export class Context {
  private static _binding = new WeakMap<ContextRequest, Context>;
  public data: Map<string, string> = new Map();

  constructor() { }

  static bindRequestContext(req: ContextRequest) {
    Context._binding.set(req, new Context());
  }

  static getRequestContext(req: ContextRequest) {
    return Context._binding.get(req) || null;
  }


  static setData(req: ContextRequest, key: string, value: string) {
    Context._binding.get(req)?.data.set(key, value);
  }

  static getData(req: ContextRequest, key: string) {
    return Context._binding.get(req)?.data.get(key);
  }
}

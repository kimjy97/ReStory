import mongoose, { Schema, Document } from "mongoose";

export interface IRequestLog extends Document {
  ip: string;
  timestamp: Date;
}

const RequestLogSchema = new Schema({
  ip: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now }
});

// Automatically clean up records older than 2 days (172800 seconds) to guarantee zero storage bloating in low-budget free-tier Atlas
RequestLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 172800 });

const RequestLog = mongoose.models.RequestLog || mongoose.model<IRequestLog>('RequestLog', RequestLogSchema);

export default RequestLog;

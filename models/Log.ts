import mongoose, { Document, Schema } from 'mongoose';

export interface ILog extends Document {
  level: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const LogSchema: Schema = new Schema({
  level: { type: String, required: true, enum: ['DEBUG', 'INFO', 'WARN', 'ERROR'] },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

const Log = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;

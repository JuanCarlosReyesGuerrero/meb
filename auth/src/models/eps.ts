import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';

/*
 *   Interface that describes the properties
 *   that are required to create a new EPS
 */

interface EpsAttrs {
  name: string;
}

/*
 *   Interface that describes the properties
 *   that a Eps Document has
 */
interface EpsDoc extends mongoose.Document {
  name: string;
}

/*
 *   Interface that describes the properties
 *   that a Eps Model has
 */

interface EpsModel extends mongoose.Model<EpsDoc> {
  build(attrs: EpsAttrs): EpsDoc;
}

const epsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  },
});

epsSchema.set('versionKey', 'version');
epsSchema.plugin(updateIfCurrentPlugin);

epsSchema.statics.build = (attrs: EpsAttrs) => {
  return new Eps(attrs);
};

const Eps = mongoose.model<EpsDoc, EpsModel>('Eps', epsSchema);

export { Eps };

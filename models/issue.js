import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  tag: [
    {
      type: String,
      required: false
    }
  ],
  link: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "ProjectModel"
  },
  createdAt: {
    type: Date,
    required: true
  }
});
issueSchema.index({name:'text',desc:'text',status:'text'});
export default mongoose.model("IssueModel", issueSchema);

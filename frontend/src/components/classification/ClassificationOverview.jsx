import DocumentCategories from "./DocumentCategories.jsx";
import ModelInformation from "./ModelInformation.jsx";

export default function ClassificationOverview({ categories = {} }) {
  return <section className="grid grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] gap-4 min-[1920px]:grid-cols-[minmax(0,1fr)_30rem] [@media(min-width:1440px)_and_(max-width:1919px)]:grid-cols-[minmax(0,1fr)_26rem] [@media(min-width:1366px)_and_(max-width:1439px)]:grid-cols-[minmax(0,1fr)_23.75rem] [@media(min-width:1280px)_and_(max-width:1365px)]:grid-cols-[minmax(0,1fr)_22rem] [@media(max-width:1279px)]:grid-cols-1"><DocumentCategories categories={categories} /><ModelInformation /></section>;
}

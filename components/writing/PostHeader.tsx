type Props = {
  date: string;
  title: string;
};

export default function PostHeader({ date, title }: Props) {
  return (
    <div className="text-center mb-4">
      <div 
        className="text-2xl text-darkGray dark:text-darkText"
      >
        {title}
      </div>
      <div className="pt-2 text-sm text-gray-700 dark:text-gray-300">{date}</div>
    </div>
  );
}
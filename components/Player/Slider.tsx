import * as RadixSlider from "@radix-ui/react-slider";

interface SlideProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SlideProps> = ({ value = 1, onChange }) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className="
        relative 
        flex 
        items-center 
        select-none 
        touch-none 
        w-full 
        h-10
      "
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.1}
      aria-label="Volume"
    >
      <RadixSlider.Track
        className="
          bg-neutral-600 
          relative 
          grow 
          rounded-md 
          h-[5px]
        "
      >
        <RadixSlider.Range
          className="
            absolute 
            bg-red-500 
            rounded-md 
            h-full
          "
        />
        {/* Add the circle */}
        <RadixSlider.Thumb
          className="
            absolute 
            w-3
            h-3 
            rounded-full 
            bg-white 
            focus:bg-red-500 
            hover:bg-red-300 
            transform 
            -translate-y-1
            -translate-x-1/2 
            pointer-events-auto
          "
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;

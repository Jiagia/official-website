import {
    Link,
    useLocation,
    useSearchParams,
    useNavigation,
  } from '@remix-run/react';
  
  export default function ProductOptions({options, selectedVariant}) {
    const {pathname, search} = useLocation();
    const [currentSearchParams] = useSearchParams();
    const navigation = useNavigation();
  
    const paramsWithDefaults = (() => {
      const defaultParams = new URLSearchParams(currentSearchParams);
  
      if (!selectedVariant) {
        return defaultParams;
      }
  
      for (const {name, value} of selectedVariant.selectedOptions) {
        if (!currentSearchParams.has(name)) {
          defaultParams.set(name, value);
        }
      }
  
      return defaultParams;
    })();
  
    // Update the in-flight request data from the 'navigation' (if available)
    // to create an optimistic UI that selects a link before the request is completed
    const searchParams = navigation.location
      ? new URLSearchParams(navigation.location.search)
      : paramsWithDefaults;
    return (
      <div className="grid gap-4 mb-6">
        {options.map((option) => {
          if (!option.values.length) {
            return;
          }
  
          // get the currently selected option value
          const currentOptionVal = searchParams.get(option.name);
          return (
            <div
              key={option.name}
              className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
            >
              <div className="whitespace-pre-wrap max-w-prose font-bold text-lead text-base min-w-[4rem]">
                {option.name}
              </div>
  
              <div className="flex flex-wrap items-baseline gap-4">
                {option.values.map((value) => {
                  const linkParams = new URLSearchParams(searchParams);
                  const isSelected = currentOptionVal === value;
                  linkParams.set(option.name, value);
                  return (
                    <Link
                      key={value}
                      to={`${pathname}?${linkParams.toString()}`}
                      preventScrollReset
                      replace
                      className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                        isSelected ? 'border-gray-500' : 'border-neutral-50'
                      }`}
                    >
                      {value}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
"use client";
import { useDebouncedValue } from "hooks/useDebouncedValue";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import type { SearchBoxSuggestion } from "@mapbox/search-js-core";
import { useSearchBoxCore, useSearchSession } from "@mapbox/search-js-react";
import React, { forwardRef, useEffect, useState } from "react";

interface MapboxSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  accessToken: string;
}

const MapboxSearch = forwardRef<HTMLInputElement, MapboxSearchProps>(
  ({ accessToken, ...props }, ref) => {
    const [searchTerm, setSerchTerm] = useState("");
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

    const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([]);

    const searchBoxCore = useSearchBoxCore({ accessToken: accessToken });
    const searchSession = useSearchSession(searchBoxCore);

    const grabSuggestionInfo = async (
      selectedSuggestion: SearchBoxSuggestion
    ) => {
      if (searchSession.canRetrieve(selectedSuggestion)) {
        const suggestionInfo = await searchSession.retrieve(selectedSuggestion);
      }
    };

    useEffect(() => {
      const grabSuggestions = async () => {
        try {
          const suggestions = await searchSession.suggest(debouncedSearchTerm);
          if (suggestions.suggestions) {
            setSuggestions(suggestions.suggestions);
          }
        } catch (error) {
          console.error(error);
        }
      };

      if (debouncedSearchTerm !== "") {
        grabSuggestions();
      }
    }, [debouncedSearchTerm, searchBoxCore, searchSession]);

    return (
      <Combobox immediate>
        <ComboboxInput
          ref={ref}
          placeholder="Search"
          {...props}
          value={searchTerm}
          onChange={(e) => setSerchTerm(e.target.value)}
        />
        <ComboboxOptions
          anchor="bottom"
          as="ul"
          className="w-72 space-y-2.5 rounded-xl border bg-slate-400 p-2.5 shadow-xl empty:invisible"
        >
          {suggestions.map((suggestion) => (
            <ComboboxOption
              as="li"
              key={suggestion.mapbox_id}
              value={suggestion}
              className="text-sm"
            >
              <div className="flex cursor-pointer flex-row items-center gap-2 truncate">
                <span className="rounded-full bg-slate-50 p-1">
                  <MapPinIcon className="size-5" />
                </span>
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold">{suggestion.address}</p>
                  <p className="text-xs">{suggestion.place_formatted}</p>
                </div>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    );
  }
);

MapboxSearch.displayName = "MapboxSearchBox";

export { MapboxSearch };

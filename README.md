# React Scroller Greenfield

I needed a carousel-like component that was acutely aware of its children. It ended up being marginally performant but adding observables moved management of scroll position more into the dom than I would have preferred. This relies on calling forceUpdate to receive key values from the current dom state.

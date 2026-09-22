SELECT a.dst AS via,b.dst AS destination,a.cost+b.cost AS cost FROM edges a JOIN edges b ON b.src=a.dst WHERE a.src='A' ORDER BY via,destination;

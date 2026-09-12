"""Independent checks for puzzle results and generated-site integrity."""
import heapq
import json
import math
import re
import tempfile
import unittest
from pathlib import Path
from build import build, validate
from puzzles import PUZZLES

class PuzzleTests(unittest.TestCase):
    def test_schema_and_export(self):
        validate()
        with tempfile.TemporaryDirectory() as folder:
            target = build(folder)
            html = (target / 'index.html').read_text(encoding='utf-8')
            data = re.search(r'<script id="puzzleData" type="application/json">(.*?)</script>', html, re.S).group(1)
            self.assertEqual(json.loads(data), PUZZLES)
            for asset in ('app.js','style.css','.nojekyll'):
                self.assertTrue((target / asset).is_file())
            self.assertNotIn('__PUZZLES__', html)

    def test_bridge_minimum_by_shortest_path(self):
        from itertools import combinations
        times = [1,2,5,10]
        queue = [(0,0,0)]
        best = {}
        while queue:
            cost, mask, side = heapq.heappop(queue)
            if (mask, side) in best:
                continue
            best[mask,side] = cost
            if mask == 15 and side == 1:
                self.assertEqual(cost,17)
                return
            available = [i for i in range(4) if ((mask >> i) & 1) == side]
            for count in (1,2):
                for group in combinations(available,count):
                    new_mask = mask
                    for i in group:
                        new_mask ^= 1 << i
                    heapq.heappush(queue,(cost+max(times[i] for i in group),new_mask,1-side))
        self.fail('No crossing strategy found')

    def test_river_minimum_by_search(self):
        from collections import deque
        queue = deque([(0,0)])
        seen = {0}
        while queue:
            state, steps = queue.popleft()
            if state == 15:
                self.assertEqual(steps,7)
                return
            farmer = state & 1
            for cargo in (0,2,4,8):
                if cargo and bool(state & cargo) != bool(farmer):
                    continue
                nxt = state ^ 1 ^ cargo
                f,w,g,c = [bool(nxt & (1 << i)) for i in range(4)]
                if (w == g != f) or (g == c != f):
                    continue
                if nxt not in seen:
                    seen.add(nxt); queue.append((nxt,steps+1))
        self.fail('No river solution found')

    def test_probability_and_counting(self):
        def birthday(n):
            return 1-math.prod((365-i)/365 for i in range(n))
        self.assertLess(birthday(22),0.5)
        self.assertGreater(birthday(23),0.5)
        self.assertAlmostEqual(1-sum(1/k for k in range(51,101)),0.3118278207)
        self.assertEqual(math.comb(4,2)/(4*48+math.comb(4,2)),1/33)
        self.assertEqual(next(m for m in range(1,100) if m*(m+1)//2 >= 100),14)
        self.assertEqual([n for n in range(1,101) if sum(n%d==0 for d in range(1,n+1))%2], [i*i for i in range(1,11)])

    def test_cheryl_by_knowledge_elimination(self):
        dates = [('May',15),('May',16),('May',19),('June',17),('June',18),('July',14),('July',16),('August',14),('August',15),('August',17)]
        unique_days = {d for _,d in dates if sum(day==d for _,day in dates)==1}
        excluded = {m for m,d in dates if d in unique_days}
        first = [(m,d) for m,d in dates if m not in excluded]
        second = [(m,d) for m,d in first if sum(day==d for _,day in first)==1]
        final = [(m,d) for m,d in second if sum(month==m for month,_ in second)==1]
        self.assertEqual(final,[('July',16)])

if __name__ == '__main__':
    unittest.main()

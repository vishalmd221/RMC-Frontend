import { useState } from 'react';

import './App.css';
import Header from './Components/Header';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />

        {/* Dropdown Menu */}
        <div className="relative">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold">Welcome to the RMC Blockchain App</h2>
          </div>
          <Select>
            <SelectTrigger className="w-[180px] text-amber-50">
              <SelectValue placeholder="Select a document" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Documents</SelectLabel>
                <SelectItem value="apple">Birth CeFrtificate</SelectItem>
                <SelectItem value="banana">Death Certificate</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

export default App;

// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RMContract is ERC721, ERC721URIStorage, Ownable {

    address immutable builder = 0x4E3386E4313d299B116995e426143e2d4e3606B3;
    address immutable propertyOwner= 0xEB669C54Ec7A4E6eE69025931ab1e2fC2Ff28631;
    address immutable RMC= 0x5969Ad5Abb6D9f1A0336579AD094828d4c3D3140;

    struct propertyDetails {
        string Name;
        string Address;
        address ownerAddress;
        uint Number;
        string Gender;
        uint SqFoot;
        string PanCardNumber;
        bool isSignedByOwner;
        bool isVerifiedByRMC;
    }

    uint256 private _nextTokenId;
    mapping (uint=> propertyDetails) public tokenIdDetails;
    mapping (uint=> bool) hashSignedByOwner;
    mapping (uint=> bool) hashVerifiedByRMC;

    uint256[] private _allTokens;

    constructor(address initialOwner)
        ERC721("Municipal Corporation Doc", "RMC")
        Ownable(initialOwner)
    {}

    function createDocByBuilder (propertyDetails memory _propertyDetails,string memory _tokenURI) external {
        // require(builder == msg.sender, "Only builder can create token");
        uint256 tokenId = _nextTokenId++;
        _safeMint(_propertyDetails.ownerAddress, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenIdDetails[tokenId] = _propertyDetails; 
        _allTokens.push(tokenId);
    }  

    function getAllTokenIds() external view returns (uint256[] memory) {
        return _allTokens;
    }

    function signDoc (uint _tokenId) external{
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        // require(msg.sender == _propertyDetails.ownerAddress,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==false,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.isSignedByOwner=true;
    }   

    function updateName( uint _tokenId, string memory _name) external{
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        // require(msg.sender == _propertyDetails.ownerAddress,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==false,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.Name=_name;
    }
    function updateAddress( uint _tokenId, string memory _address) external {
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        // require(msg.sender == _propertyDetails.ownerAddress,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==false,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.Address=_address;
    }
    function updateNumber( uint _tokenId, uint _number) external {
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        // require(msg.sender == _propertyDetails.ownerAddress,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==false,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.Number=_number;
    }
    function updateGender( uint _tokenId, string memory _gender) external {
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        // require(msg.sender == _propertyDetails.ownerAddress,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==false,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.Gender=_gender;
    }
    function updateSqFoot( uint _tokenId, uint _sqFoot) external {
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        // require(msg.sender == _propertyDetails.ownerAddress,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==false,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.SqFoot=_sqFoot;
    }
    function updatePanCardNumber( uint _tokenId, string memory _panCardNumber) external {
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        // require(msg.sender == _propertyDetails.ownerAddress,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==false,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.PanCardNumber = _panCardNumber;
    }

    function verifyDoc (uint _tokenId ) external{
        propertyDetails storage _propertyDetails = tokenIdDetails[_tokenId];
        require(msg.sender == RMC,"not authorized user to sign this doc");
        require(_propertyDetails.isSignedByOwner  ==true,"Already signed");
        require(_propertyDetails.isVerifiedByRMC  ==false,"Already Verified by RMC");

        _propertyDetails.isVerifiedByRMC=true;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
